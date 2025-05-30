# Use AdoptOpenJDK 17 as the build stage
FROM  openjdk:17-jdk-slim  AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
# Clean the Maven cache
RUN rm -rf /root/.m2/repository
RUN apt-get update && apt-get install -y maven
RUN mvn -f pom.xml install -Dmaven.test.skip

# Use AdoptOpenJDK 17 as the final runtime stage
FROM openjdk:17-jdk-slim-buster
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8039
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar", "app.jar"]
