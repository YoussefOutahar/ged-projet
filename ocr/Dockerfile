#FROM maven:3.6.1-jdk-8-slim AS build
FROM adoptopenjdk:8-jdk-hotspot-bionic AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
RUN apt-get update && apt-get install -y maven
RUN mvn -f pom.xml clean install -Dmaven.test.skip

# Définition de la variable d'environnement pour le profil d'application
#ENV SPRING_PROFILES_ACTIVE=prod

#FROM openjdk:8-alpine
FROM adoptopenjdk:8-jre-hotspot-bionic
RUN apt-get update && apt-get -y install tesseract-ocr imagemagick
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8038
ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","app.jar"]
