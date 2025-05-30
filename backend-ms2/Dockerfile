# Utilisation d'une image de base adoptopenjdk avec JDK 8
FROM adoptopenjdk:8-jdk-hotspot-bionic AS build

# Création d'un répertoire de travail
RUN mkdir -p /workspace
WORKDIR /workspace
# Copie du fichier pom.xml et du répertoire src dans le conteneur
COPY pom.xml /workspace
COPY src /workspace/src

# Installation de Maven
RUN apt-get update && apt-get install -y maven

# Exécution de Maven pour construire l'application
RUN mvn -f pom.xml clean install -U -DskipTests


#FROM openjdk:8-alpine
FROM adoptopenjdk:8-jre-hotspot-bionic

RUN mkdir -p /app/data/security && \
    chmod 755 /app && \
    chmod 700 /app/data/security 

COPY --from=build /workspace/target/*.jar app.jar

ENV CLASSPATH=/app:${CLASSPATH}

EXPOSE 8036
# Définir les options JVM comme des arguments
ENV JAVA_OPTS="-Xms8g -Xmx8g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:InitiatingHeapOccupancyPercent=45 -Xloggc:/logs/gc.log -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps"

ENV SPRING_APPLICATION_JSON='{"app":{"security":{"keyfile":"/app/data/security/master.key"}}}'

# Commande d'exécution de l'application avec les options JVM
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]

