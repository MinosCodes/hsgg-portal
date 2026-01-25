FROM eclipse-temurin:25-jdk AS build
WORKDIR /workspace

COPY . .
RUN ./gradlew --no-daemon :server:dependencies || true
RUN ./gradlew --no-daemon :server:bootJar -x test

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /workspace/server/build/libs/*.jar app.jar
COPY --from=build /workspace/client /client

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
