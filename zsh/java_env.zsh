export JAVA_HOME=$(/usr/libexec/java_home -v1.8)

export M2_HOME=$(brew --prefix maven)/libexec
export M2=$M2_HOME/bin

export MAVEN_OPTS='-Xms512m -Xmx2024m -XX:PermSize=64m -XX:MaxPermSize=128M'

function java8() {
    export JAVA_HOME=$(/usr/libexec/java_home -v1.8)
}

function java7() {
    export JAVA_HOME=$(/usr/libexec/java_home -v1.7)
}