export GISTY_DIR="$HOME/Code/gists"

# Setup environment for development
PROJECT_PATHS=(~/Code ~/Documents/Work ~/Projects)
# Oracle Weblogic Middleware Home
export MW_HOME="/Users/bryce/Oracle/Middleware"
export USER_MEM_ARGS="-Xmx1024m -XX:MaxPermSize=256m"

#export JAVA_HOME=$(/usr/libexec/java_home -v1.6)
export JAVA_HOME=$(/usr/libexec/java_home -v1.8)
export MAVEN_OPTS='-Xms128m -Xmx796m -XX:PermSize=64m -XX:MaxPermSize=172m'

export DEV1_ENV="wmecrmd01.idexxi.com"
export DEV2_ENV="wmecrmd02.idexxi.com"
export QA1_ENV="wmecrmq01.idexxi.com"
export QA2_ENV="wmecrmq02.idexxi.com"
export PR1_ENV="wmecrmp01.idexxi.com"
export PR2_ENV="wmecrmp02.idexxi.com"

export IDEXX_USER_NAME="bfischer"

#  MOUNT POINTS FOR SSH
export DEV1_MOUNT="/Users/bryce/Mounts/beaconMounts/dev1"
export DEV2_MOUNT="/Users/bryce/Mounts/beaconMounts/dev2"
export QA1_MOUNT="/Users/bryce/Mounts/beaconMounts/qa1"
export QA2_MOUNT="/Users/bryce/Mounts/beaconMounts/qa2"
export PR1_MOUNT="/Users/bryce/Mounts/beaconMounts/pr1"
export PR2_MOUNT="/Users/bryce/Mounts/beaconMounts/pr2"

export BEACON_TRUNK="/Users/bryce/Code/BEACON"
export BEACON_BRANCH="/Users/bryce/Code/BEACON_branch"

export SVN_ROOT=http://amherst/subversion/POC
export BEACON_REP_ROOT=$SVN_ROOT/Applications/BEACON/

export LC_ALL=C

export WEBAPP_TRUNK=$BEACON_TRUNK/WebClient/BEACONSenchaWebClient/src/main/webapp
