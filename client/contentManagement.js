if (!api) throw new Error("api.js not working or not loaded.");

const POST_TITLE_KEY = 'title';
const POST_CONTENT_FILE_ID_KEY = 'content-file-id';
const POST_SOLUTION_FILE_ID_KEY = 'solution-file-id';

const POST_ATTRIBUTE_NAMES = Object.freeze([
  POST_TITLE_KEY,
  POST_CONTENT_FILE_ID_KEY,
  POST_SOLUTION_FILE_ID_KEY
]);

/**
 * Checks whether a value is (theoretcally) a valid backend ID.
 * 
 * Only looks at the value and doesn't actually check anything with the backend.
 * 
 * @param {numer} id The id to check.
 * @returns True if valid false if not.
 */
const validBackendId = (id) => typeof id === 'number' && Number.isSafeInteger(id) && id >= 0;

/**
 * Splits a Post ID into its Topic ID and Block ID components.
 * 
 * @param {string} postId The Post ID formated like this: \<topicId\>_\<blockId\>
 * @returns An object containing the topicId and blockId as numbers.
 */
const splitPostId = (postId) => {
  if (typeof postId !== 'string') throw new Error("ID must be of type string but is of type " + typeof postId);

  const parts = postId.split('_');
  if (parts.length !== 2) throw new Error("Expected ID to be formated as \"<topic>_<block>\".");

  const [topicId, blockId] = parts.map(Number);
  if (!validBackendId(topicId)) throw new Error("The topicId part of the post ID isn't a valid backend ID.");
  if (!validBackendId(blockId)) throw new Error("The blockId part of the post ID isn't a valid backend ID.");

  return { topicId, blockId };
}

/**
 * Checks whther the contents of a post are theoretically valid.
 * 
 * IDs only get a "looks OK" check and don't get checked with the backend.
 * 
 * @param {object} postContent The Post content to validate.
 * @throws Error if anything is invalid.
 */
const validatePostContent = (postContent) => {
  if (typeof postContent !== 'object' ||
    postContent == null ||
    Array.isArray(postContent)
  ) throw new Error("The postContent needs to be an object. (not null, not array)");

  if (Object.keys(postContent).some((name) => !POST_ATTRIBUTE_NAMES.includes(name))) throw new Error("Post contains an unknown attribute.");

  if (typeof postContent[POST_TITLE_KEY] !== 'string' || postContent[POST_TITLE_KEY].includes('\n')) throw new Error("The Title is not a single line string.");
  if (!validBackendId(postContent[POST_CONTENT_FILE_ID_KEY])) throw new Error("The content file id is invalid.");
  if (postContent[POST_SOLUTION_FILE_ID_KEY] != null && !validBackendId(postContent[POST_SOLUTION_FILE_ID_KEY])) throw new Error("The solution file id is set but invalid.");
}

/**
 * Creates a new Post on the backend.
 * 
 * @param {number} topicId ID of the topic the post should be on.
 * @param {string} title Title of the post. (single line)
 * @param {File} contentFile Instance of the File class containing the Content file of the post. (will be uploaded)
 * @param {File?} solutionFile (Optional) Instance of the File class containing the Content file of the post. (will be uploaded)
 */
const createPost = async (topicId, position, title, contentFile, solutionFile) => {
  if (!api.getRole()) throw new Error("Not logged in.");

  if (!validBackendId(topicId)) throw new Error("Topic ID can't be valid.");
  // Not an Id but the check is the same
  if (!validBackendId(position)) throw new Error("Position has an invalid value.");
  
  const postContent = {};
  postContent[POST_TITLE_KEY] = title;
  validatePostContent(postContent);

  if (!(contentFile instanceof File)) throw new Error("Content file is not an instance of File.");
  if (solutionFile != null && !(solutionFile instanceof File)) throw new Error("Solution file is set and not an instance of File.");
  
  try {
    await api.getTopic(topicId);
  } catch (_) {
    throw new Error("Couldn't get the specified topic.");
  }

  try {
    const info = await api.uploadFile(topicId, contentFile);
    postContent[POST_CONTENT_FILE_ID_KEY] = info.id;
  } catch (_) {
    throw new Error("Content file upload failed.");
  }

  if (solutionFile != null) {
    try {
      const info = await api.uploadFile(topicId, solutionFile);
      postContent[POST_SOLUTION_FILE_ID_KEY] = info.id;
    } catch (_) {
      throw new Error("Solution file upload failed.");
    }
  }
  
  try {
    await api.createTextBlock(topicId, title, position, JSON.stringify(postContent));
  } catch (_) {
    throw new Error("Creating the text block failed.");
  }
}

/**
 * Takes a Post ID and returns the post for it or errors.
 * 
 * @param {string} id The ID of the Post.
 * @returns The Post.
 * @throws Error if it fails for any reason.
 */
const getPost = async (id) => {
  if (!api.getRole()) throw new Error("Not logged in.");

  const { topicId, blockId } = splitPostId(id);

  const topicContent = await api.getTopicContent(topicId);
  const block = topicContent.find(b => b.id === blockId);
  if (block == null) throw new Error("Couldn't find block in topic.");
  
  const postContent = JSON.parse(block.text);
  validatePostContent(postContent);

  return postContent;
}

/**
 * Tries to parse all textblocks of the specified topic as posts and returns an array of those it was successful with.
 * 
 * @param {number} topicId ID of the topic.
 * @returns An array of objects containing the id, position and content of the post.
 */
const getAllPostsForTopic = async (topicId) => {
  if (!api.getRole()) throw new Error("Not logged in.");
   
  const topicContent = await api.getTopicContent(topicId);

  const posts = [];
  for (const block of topicContent) {
    try {
      const content = JSON.parse(block.text);
      validatePostContent(content);
      posts.push({
        id: `${topicId}_${block.id}`,
        position: block.position,
        content
      });
    } catch (_) { }
  }

  posts.sort((a, b) => a.position - b.position);

  return posts;
}
/**
 * Updates a post.
 * 
 * File deletions are handled if neccessary.
 * 
 * @param {string} id The Post ID.
 * @param {{ position: number, content: object }} obj An Object optionally containing the new position and/or content.
 */
const updatePost = async (id, { position, content }) => {
  if (!api.getRole()) throw new Error("Not logged in.");
  
  const { blockId } = splitPostId(id);

  if (position == null && content == null) return;

  const newBlock = {};

  if (position != null) {
    newBlock.position = position;
  }
  if (content != null) {
    validatePostContent(content);
    newBlock.text = JSON.stringify(content);
  }
  
  const oldPost = await getPost(id);

  await api.updateTextBlock(blockId, newBlock);

  if (content == null) return;

  if (oldPost[POST_CONTENT_FILE_ID_KEY] !== content[POST_CONTENT_FILE_ID_KEY]) await api.deleteFile(oldPost[POST_CONTENT_FILE_ID_KEY]);
  if (oldPost[POST_SOLUTION_FILE_ID_KEY] != null && oldPost[POST_SOLUTION_FILE_ID_KEY] !== content[POST_SOLUTION_FILE_ID_KEY]) await api.deleteFile(oldPost[POST_SOLUTION_FILE_ID_KEY]);
}

/**
 * Deletes a Post and all associated files.
 * 
 * @param {string} id The Post ID.
 */
const deletePost = async (id) => {
  if (!api.getRole()) throw new Error("Not logged in.");
  
  const { blockId } = splitPostId(id);

  const content = await getPost(id);
  
  await api.deleteFile(content[POST_CONTENT_FILE_ID_KEY]);
  if (content[POST_SOLUTION_FILE_ID_KEY] != null) await api.deleteFile(content[POST_SOLUTION_FILE_ID_KEY]);
  await api.deleteContentBlock(blockId);
}