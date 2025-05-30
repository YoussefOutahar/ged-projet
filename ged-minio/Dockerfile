# Use ARM64-compatible Maven image as build stage
FROM adoptopenjdk:8-jdk-hotspot-bionic AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
RUN mkdir -p /GedStorage
RUN chmod 777 /GedStorage
RUN apt-get update && apt-get install -y maven
RUN mvn -f pom.xml clean install -Dmaven.test.skip

# Use ARM64-compatible OpenJDK image as the final image
FROM adoptopenjdk:8-jre-hotspot-bionic
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8036
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","app.jar"]
