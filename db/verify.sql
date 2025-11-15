-- run with: type db\verify.sql | docker exec -i hsgg-db mariadb -uhsgguser -psecret hsgg

-- ============================================
-- DB integrity & seed validation
-- ============================================

SELECT '--- TABLE COUNTS ---' AS section;

SELECT 'subjects' AS table_name, COUNT(*) AS row_count FROM subjects;
SELECT 'topics' AS table_name, COUNT(*) AS row_count FROM topics;
SELECT 'content_blocks' AS table_name, COUNT(*) AS row_count FROM content_blocks;
SELECT 'files' AS table_name, COUNT(*) AS row_count FROM files;
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users;

-- EXPECTED:
-- subjects: 1
-- topics: 15
-- content_blocks: 60
-- files: 0 (unless added manually)
-- users: 0 or 1 (depending on if you add initial admin)

------------------------------------------------
SELECT '--- SUBJECTS ---' AS section;

SELECT id, name, slug
FROM subjects;

------------------------------------------------
SELECT '--- TOPICS ---' AS section;

SELECT id, title, slug
FROM topics
ORDER BY id;

------------------------------------------------
SELECT '--- CONTENT BLOCKS PER TOPIC ---' AS section;

SELECT
    t.slug AS topic_slug,
    COUNT(cb.id) AS content_blocks
FROM topics t
         LEFT JOIN content_blocks cb ON cb.topic_id = t.id
GROUP BY t.id
ORDER BY t.id;

-- EXPECTED: 4 blocks per topic (except future PDFs)

------------------------------------------------
SELECT '--- LIST ALL CONTENT BLOCKS ---' AS section;

SELECT
    cb.id,
    t.slug AS topic,
    cb.position,
    cb.type,
    cb.title
FROM content_blocks cb
         JOIN topics t ON cb.topic_id = t.id
ORDER BY t.id, cb.position;

------------------------------------------------
SELECT '--- VERIFY REFERENCES ---' AS section;

SELECT
    src.slug AS source_topic,
    cb.title AS block_title,
    tgt.slug AS referenced_topic
FROM content_blocks cb
         JOIN topics src ON cb.topic_id = src.id
         LEFT JOIN topics tgt ON cb.reference_topic_id = tgt.id
WHERE cb.type = 'reference'
ORDER BY src.id;

-- EXPECTED:
-- Every reference block must have a valid referenced_topic

------------------------------------------------
SELECT '--- BROKEN REFERENCES CHECK ---' AS section;

SELECT
    cb.id AS content_block_id,
    src.slug AS source_topic,
    cb.reference_topic_id AS invalid_reference
FROM content_blocks cb
         JOIN topics src ON cb.topic_id = src.id
         LEFT JOIN topics tgt ON cb.reference_topic_id = tgt.id
WHERE cb.type = 'reference'
  AND cb.reference_topic_id IS NOT NULL
  AND tgt.id IS NULL;

-- EXPECTED RESULT:
-- 0 rows

------------------------------------------------
SELECT '--- CHECK FOR NULL TITLES OR MISSING POSITIONS ---' AS section;

SELECT *
FROM content_blocks
WHERE title IS NULL OR position IS NULL;

-- EXPECTED RESULT:
-- 0 rows

------------------------------------------------
SELECT '--- CHECK FOR DUPLICATE POSITIONS ---' AS section;

SELECT
    t.slug AS topic,
    cb.position,
    COUNT(*) AS count
FROM content_blocks cb
    JOIN topics t ON cb.topic_id = t.id
GROUP BY t.slug, cb.position
HAVING COUNT(*) > 1;

-- EXPECTED RESULT:
-- 0 rows

------------------------------------------------
SELECT '--- SCHEMA VALIDATION COMPLETE ---' AS section;
