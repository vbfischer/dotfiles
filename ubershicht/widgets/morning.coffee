stylingOptions =
  background: 'rgba(#fff, 0.0)'
  # show fullscreen -> true
  fullscreen: false
  # display position 'top', 'middle', 'bottom'
  vertical: 'top'

dateOptions =
  # display not only 'time' also 'date'
  showDate: true
  # format of 'date'
  date: '%a, %B %d'

format = (->
  if dateOptions.showDate
    dateOptions.date + '\n' +'%l:%M %p'
  else
    '%l:%M %p'
)()

command: "date +\"#{format}\""

# the refresh frequency in milliseconds
refreshFrequency: 30000

# for update function
dateOptions: dateOptions

render: (output) -> """
  <div id='simpleClock'>#{output}</div>
"""

update: (output) ->
  if this.dateOptions.showDate
    data = output.split('\n')

    html = '<div class="date">'
    html += data[0]
    html += '</div>'
    html += '<div class="time">'
    html += data[1]
    html += '</div>'

  else
    html = output

  $(simpleClock).html(html)

style: (->
  fontSize = '3em'
  width = 'auto'
  transform = 'auto'
  bottom = '3%'
  top = 'auto'

  if stylingOptions.fullscreen
    fontSize = '10em'
    width = '94%'

  if stylingOptions.vertical is 'middle'
    transform = 'translateY(50%)'
    bottom = '50%'
  else if stylingOptions.vertical is 'top'
    bottom = 'auto'
    top = '3%'

  return """
    background: #{stylingOptions.background}
    color: #AAAAAA
    font-family: Avenir
    right: 5em;
    margin-left:  5em;
    margin-top: 1em;

    #simpleClock
      opacity: 0.75;
      text-shadow: 1px 1px 10px black;
      font-size: #{fontSize}
      text-align: right
  """
)()
