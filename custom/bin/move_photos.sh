#! /bin/bash

SOURCEPATH="$HOME/photo_export2"
EXPORTDIR="$HOME/photo_export"

find "$SOURCEPATH" -type f | grep -v .DS_Store > filelist.txt

total_files=`cat filelist.txt | wc -l | tr -d ' '`

fn=0

echo
echo Copying $total_files media files media files
echo from \"$SOURCEPATH\"
echo to \"$EXPORTDIR\".
echo


cat filelist.txt | while read fullfile ; do
    let fn+=1
    let percent=100*$fn/$total_files

    # Thanks:
    # http://stackoverflow.com/questions/965053/extract-filename-and-extension-in-bash
    filename="${fullfile##*/}"
    extension="${filename##*.}"
    filename="${filename%.*}"

    #echo -ne "\033[K"
    printf "Progress: %3d%% " $percent
    echo -ne "[$fn/$total_files]\n"
        echo -e " > $fullfile\033[K"

    dates=(`exiftool \
        -CreateDate \
        -MediaCreateDate \
        -DateTimeOriginal \
        -FileModifyDate \
        -d '%Y-%m-%d %H.%M.%S' \
        -S -s "$fullfile"`)

    thedate="${dates[0]} ${dates[1]}"

    filename2=$thedate
    path2="$EXPORTDIR/${thedate:0:4}/${thedate:0:7}"


    if [ ! -d "$path2" ];
    then
        mkdir -p "$path2"
    fi

    if [ ! -f "$path2/$filename2.$extension" ] ;
    then
        newfile="$path2/$filename2.$extension"
    else
        i=1
        until [ ! -f "$path2/$filename2-$i.$extension" ]; do
            let i+=1
        done
        newfile="$path2/$filename2-$i.$extension"
    fi

        echo -e " < $newfile\033[K"
        echo -ne "\r\033[3A"

    cp "$fullfile" "$newfile"

    newfile=""
done

echo -e "\nDone.\033[K"
echo -e "Check $EXPORTDIR.\033[K"
