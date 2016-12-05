function gitsubl() {
    git config --global core.editor "subl -n -w"
}

function gitvim() {
    git config --global core.editor "vim"
}

function mergesubtitles() {
  for i in *.mp4; do
    subtitle=${i:r}.eng.srt
    echo $subtitle
    output=${i:r}.cc.${i:e}
    if [[ -e $subtitle ]]; then
      ffmpeg -y -i $i -sub_charenc CP1252 -i $subtitle -map 0:v -map 0:a -c copy -map 1 -c:s:0 mov_text -metadata:s:s:0 language=eng $output
    fi;
  done
}

function updatemetadata() {
  for i in *.mp4; do
    tempfilename=${i:r}.temp.${i:e}
    origtitle=${i:r}
    mv $i $tempfilename

    ffmpeg -i $tempfilename -metadata title="$origtitle" -codec copy $i
  done
}

function convertmkv() {
  for i in *.mkv; do
    ffmpeg -i $i -vcodec copy -acodec copy ${i:r}.mp4;
  done
}

function renamevideofiles() {
  for i in *.mkv; do
    ext=${i:e}

  done
}
