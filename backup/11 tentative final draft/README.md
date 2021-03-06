# HR project
testing heroku setup for HR project

Explaining some of the denser coding blocks: 



I.     initWordBank()

   Read in data from a local file path, then reformat it into a wordBank that is tailored to the 
   needs of tweetAnalyzer. A sample of the start product:
  
  		var wordFile = {'english':[ {'word': 'love',
  									'score': 4},
  								    {'word': 'hate',
  								    'score': -4} ],
  					    'spanish':[ {'word': 'amor',
  					    			'score': 4},
  					     			{'word': 'odio',
  					     			'score': -4} ] };
  
   And a sample of the end product:
  
  		var wordBank = {'english': {'love': 4,
  									'hate': -4},
  						'spanish': {'amor': 4,
  						 			'odio': -4}};
  
  This allows for tweetAnalyzer to make rapid checks to see if a word is in a wordBank, with the following: 
  
  		wordBank['english']['love']; // ==> 4  
      OR 	wordBank['english']['odio']; // ==> undefined
      OR  wordBank['spanish']['odio']; // ==> 4
  
  tweetAnalyzer checks the Tweet's language and assigns a wordBank accordingly every time it is called. 
  
  
  
II. Concerns about Twitter stream usage limits (see streamServlet.js)

Note that I customize the get request (the stream), making a unique connection to Twitter for each user. This is NOT a good solution, according to Twitter. Twitter will, in fact, block access to accounts who make too many connections from the same IP address. 

That's a big limitation to the streaming mode of my app. A possible workaround would be to make one stream for the entire server, remove all filtering (or try to -- there would have to be something to define my request query), then receive the user parameters, make a filter from them, and apply this filter as a response.addListener('data', function(data){//and here I parse data}) to the server's stream. The user is then listening to a global stream for matches of their parameters. 

I don't like that solution, insofar as it means flooding the server with this generalized stream of tweets, of which the user(s) only cares about a tiny percent. Also, I doubt I could make a filter to detect 100% of all relevant tweets from the global stream, which will already be diluted by huge amounts of irrelevant tweets, so the user ends up seeing a much less interesting stream. 

All other solutions that I can think of would similarly ask Twitter's public stream to do something it wasn't meant to. My best solution is probably to just keep my code as is, demo for you the idea as I originally saw it, and then wait on a new tech to come out. This may not take so long: Twitter is actually developing something that	would be perfect for this app: Twitter's Site Streaming API is currently in closed beta, but, when open, it will do exactly what I'm talking about here -- make customized connections per user, for many users, for your app. When Site Stream comes out, it should be an easy inclusion to this app. 
	
	
	
III.     toggleWithCallback(elem, prop, newVal, oldVal, newOnClickMthd, oldOnClickMthd)

  elem is the html element being changed, prop is what property of elem is being changed, oldVal is what prop starts as, newVal is what it finishes as, snd the last two inputs are optional callbacks. 

  elem.prop will toggle back and for between oldVal and newVal. Zero, one, or two callbacks may also be accepted. With zero, no callbacks are fired. With one callback given, clickAction uses that callback for both toggle states. If two are, clickAction uses the first callback when elem.prop = newVal, and the second callback when elem.prop = oldVal.

  This is a dense bit of coding; I used it because of how space intensive it was getting, to keep toggling all the different html element properties. Giving the optional callbacks was a way to 
  avoid if statements around every re-assignment of the elements. 


IV.      Comments on geocoding usage

 I've found that geocoders are not very well-suited for streaming live data.  They'll briefly stop working if you exceed some per-second query limit which is not clearly stated in the 
 documentation. To work around this, I spread the workload over four geocoders: Google, mapQuest, Open Cage, and bing. This alleviates the issue of maxing out the per-second limit
 for most instances, the exception being when you're tracking a massively trending topic (recently, Villanova won the NCAA championship in dramatic fashion -- the four geocoders couldn't
 keep up for very long, immediately after the game).

 I implement the group of geocoders with a 'turnstileCount' variable in a switch statement. 'turnstileCount' has four possible values, 0-3, each representing one of the geocoders. In 
 the case for the current geocoder, it increments 'turnstileCount' by one, so that, the next time this function is called, the next case in line will be used. When it hits the end of the line, 
 case 3, 'turnstileCount' is reset to 0, and the process begins again.  

 Google comes equipped with a geocoder constructor, which I utilize, and Open Cage and mapQuest are similar enough that I pass them both to the same helper function. bing rejected my CORS query attempt, so I use the request url as the src to a script, and include a callback in the request, such that the src script will grab the data from the page and pass it to createTweetCircle.
	




