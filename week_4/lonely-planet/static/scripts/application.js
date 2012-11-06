//spanish,french,bengali,chinese,hindi,korean,russian,swahili,german,turkish,arabic,japanese,portugues
//solitario,solitaire,একাকী,寂寞,अकेला,고독한,одинокий,upweke,einsam,yalnız,متوحد,寂しい,solitário

//  Now that we've included jQuery we can use its syntax for determining if
//  the full HTML page has been loaded. Waiting for the document to be ready
//  helps us avoid strange errors--because if our document is ready that means
//  all of our JavaScript libraries should have properly loaded too!
var pins = [],
	userPin

$( document ).ready( function(){

	$('#flag').click(function(){		
		$('#control_panel').toggleClass("shown", "hidden")
	})

	$('#show_tweets').click(function(){
		$('#hide_tweets').removeClass('active')
		$(this).addClass('active')
		$('#nav').removeClass('hidden_tweets').addClass('shown').addClass('active')	
	})

	$('#hide_tweets').click(function(){
		$('#show_tweets').removeClass('active')
		$(this).addClass('active')
		$('#nav').removeClass('shown').addClass('hidden_tweets')
	})

	//callback
    function uAreHere( x, y ){
      	userPin = dropPin(Number(x), Number(y), 0xFF00FF )

		group.add( userPin )
      	
      	// pins.push( userPin )

		urh = new THREE.Mesh(
				textGeo = new THREE.TextGeometry( "You are here", {

					size: 12,
					height: 2,
					curveSegments: 2,

					font: "helvetiker",
					weight: "normal",
					style: "normal",

					bevelThickness: 2,
					bevelSize: 1.5,
					bevelEnabled: true,

					material: 0,
					extrudeMaterial: 1

				}),
			
			new THREE.MeshBasicMaterial({ 
				color: 0xFF00FF,
				transparent : false,
			})
		)

		textWhy = new THREE.TextGeometry( "Why", { size: 10, height: 5, curveSegments: 6, font: "helvetiker", weight: "normal", style: "normal" });

		// console.log("text", urh)

		scene.add( textWh )

    }

    var ws = new WebSocket("ws://localhost:8000/socket");
    ws.onmessage = function(event) {
       
    	var tweet = JSON.parse(event.data)
  
    	var noBeliebers = /one less lonely girl/i,
       	    belieber = noBeliebers.test(tweet.text),
       	    noLinks = /http/i
       	    links = noLinks.test(tweet.text)
       	    noAtMentions = /@/g
       	    atMention = noAtMentions.test(tweet.text)
       	    split = tweet.text.split(' ')

   	  if ( belieber === false && split[0] !== 'RT' && links === false ){ //tweet.user.followers_count <= 100 &&

        if ( tweet.geo !== null ){
       		// console.log("from tweet geo")

	       	var lat = tweet.geo.coordinates[0],
				lon = tweet.geo.coordinates[1],
				pin = dropPin(lat, lon, 0xFFFFFF, tweet )

			group.add( pin )
			pins.push( pin )

        } else if ( tweet.place !== null) {

       		var fullname = tweet.place.full_name
	       		fullname = fullname.split(', ')

       		var city = fullname[0],
       			state = fullname[1],
       			country = tweet.place.country

       		$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?' + city + ',+' + state + ',+' + country + '&sensor=false&callback=?', function(data){

       			// console.log("from place", data)

		       	var lat = tweet.geo.coordinates[0],
					lon = tweet.geo.coordinates[1],
					pin = dropPin(lat, lon, 0xFFFFFF, tweet )					

       			group.add( pin )
       			pins.push(pin)

       		})
       	} else if (tweet.user.location !== '' ){

       		var location = tweet.user.location
	    		location = location.replace(',', '+')
	    		location = location.replace(/\s+/, '+')

       		$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&sensor=false', function(data){

       			if( data.status !== "ZERO_RESULTS"){
	       			
					// console.log(data.status)

	       			var lat = data.results[0].geometry.location.lat,
	       				lon = data.results[0].geometry.location.lng,
	       				pin = dropPin(lat, lon, 0xFFFFFF, tweet )  //CC11

	       			group.add( pin )
	       			pins.push(pin)		
	       		}
       				
       		})

       }

    	var tweetString = '<div class="tweet"><div class="img"><img src="' + tweet.user.profile_image_url + '"/></div><div class="tweet-wrapper">'
    		tweetString += '<div class="user-name"><a href="http://twitter.com/' + tweet.user.screen_name + '" Target="_blank"> ' + tweet.user.name + '</a>'
    		tweetString += '</div><div class="followers">followers: ' + tweet.user.followers_count + '</div><div class="tweet-text"> ' + tweet.text + '</div></div></div>'											
       
        $('#tweets').prepend(tweetString)	      

    	$('.tweet').first().hide().fadeIn()

    	// $('.tweet').eq(5) ? $('.tweet').eq(5).fadeOut(1000) : null 	       

	  }

    }

    //setup
	setupThree()

	//add lights
	addLights()

	//add controls
	addControls()

	//add stars
	addStars()

	window.group = new THREE.Object3D()

	//get user location
    GEO_LOCATION.getLocation(uAreHere, 12000);

    // textWhy = new THREE.TextGeometry( "Why", { size: 10, height: 5, curveSegments: 6, font: "helvetiker", weight: "normal", style: "normal" });

	//  useful resource: http://www.celestiamotherlode.net/catalog/earth.php

	var earthTexture = THREE.ImageUtils.loadTexture( "http://localhost:8000/static/media/good-earth/small-bump.jpeg" );

	window.earthRadius = 90
	window.earth = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius, 64, 64 ),
		new THREE.MeshPhongMaterial( { 
			map: THREE.ImageUtils.loadTexture( 'http://localhost:8000/static/media/good-earth/small-map.jpg' ), 
			transparency: true, 
			opacity: 1, 
			ambient: 0xFFFFFF, 
			color: 0xFFFFFF, 
			specular: 0xFFFFFF, 
			shininess: 25, 
			perPixel: true, 
			bumpMap: 
			earthTexture, 
			bumpScale: 19, 
			metal: true 
		})
	)

	earth.position.set( 0, 0, 0 )
	earth.receiveShadow = true
	earth.castShadow = true
	group.add( earth )

	//  Check out this really useful resource for understanding the blending
	//  modes available in Three.js:
	//	http://mrdoob.github.com/three.js/examples/webgl_materials_blending_custom.html

	window.clouds = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 2, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'http://localhost:8000/static/media/good-earth/small-clouds.png' ),
			transparent: true,
			blending: THREE.CustomBlending,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.SrcColorFactor,
			blendEquation: THREE.AddEquation
		})
	)
	clouds.position.set( 0, 0, 0 )
	clouds.receiveShadow = true
	clouds.castShadow = true
	// group.add( clouds )	

	window.atmosphere = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 4, 32, 32 )

	)
	clouds.position.set( 0, 0, 0 )
	clouds.receiveShadow = true
	clouds.castShadow = true
	// group.add( clouds )	

	scene.add( group )

	//  But also, did you want to start out looking at a different part of
	//  the Earth?

	group.rotation.y = ( -40 ).degreesToRadians()
	group.rotation.z = (  23 ).degreesToRadians()

	var urlPrefix	= "http://localhost:8000/static/media/";
	var urls = [ 
			urlPrefix + "posx.jpeg", 
			urlPrefix + "negx.jpeg",
			urlPrefix + "posy.jpeg", 
			urlPrefix + "negy.jpeg",
			urlPrefix + "posz.jpeg", 
			urlPrefix + "negz.jpeg" 
		]
	
	    cubemap = THREE.ImageUtils.loadTextureCube(urls);

		// cubemap.format = THREE.RGBFormat;

    // var shader = THREE.ShaderUtils.lib[ "cube" ];
    //     shader.uniforms[ "tCube" ].texture = cubemap;

    // var material = new THREE.ShaderMaterial( {

    //       fragmentShader: shader.fragmentShader,
    //       vertexShader: shader.vertexShader,
    //       uniforms: shader.uniforms,
    //       depthWrite: false

    //     });

	var material = new THREE.MeshLambertMaterial({
	    color: 0xffffff,
	    envMap: cubemap	
	  });

	var skybox = new THREE.Mesh( new THREE.CubeGeometry( 5000, 5000, 5000 ), material ) ;
        skybox.scale.x = -1   

    console.log("skybox", skybox)

    // scene.add(skybox);

	loop()	
})




function loop(){

	//  Let's rotate the entire group a bit.
	//  Then we'll also rotate the cloudsTexture slightly more on top of that.

	group.rotation.y  += ( 0.07 ).degreesToRadians()
	clouds.rotation.y += ( 0.04 ).degreesToRadians()

	if (camera.position.z > 300 ) {
		camera.position.z -= 1
	}


	if ( pins.length > 0 ) {
		$.each(pins, function(i){
			if ( pins[i].dead ){				
				

				pins[i].children[0].children[1].visible = false
				// scene.remove( scene.__objects[i + 2] )
				// delete pins[i].children[0].children[1]
				// renderer.deallocateObject( pins[i].children[0].children[1] )				

			} else {
				
				pins[i].fadeMarker()
				pins[i].fadeIndicator()
				pins[i].spike()
				
			}

			// console.log(pins[i].dead)
		})
	}

	render()
	controls.update()
	
	
	//  This function will attempt to call loop() at 60 frames per second.
	//  See  this Mozilla developer page for details:
	//  https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
	//  And also note that Three.js modifies this function to account for
	//  different browser implementations.
	
	window.requestAnimationFrame( loop )
}




//  Nesting rotations correctly is an exercise in patience.
//  Imagine that our marker is standing straight, from the South Pole up to
//  the North Pole. We then move it higher on the Y-axis so that it peeks
//  out of the North Pole. Then we need one container for rotating on latitude
//  and another for rotating on longitude. Otherwise we'd just be rotating our
//  marker shape rather than rotating it relative to the Earth.

function dropPin( latitude, longitude, color, tweet ){

	var 
	group1 = new THREE.Object3D(),
	group2 = new THREE.Object3D(),
	markerLength = 10,
	marker = new THREE.Mesh(
		new THREE.CylinderGeometry( .05, .25, 15, false ),
		new THREE.MeshBasicMaterial({ 
			color: color,
			transparent : true,
		})
	),
	indicator = new THREE.Mesh(
		new THREE.CylinderGeometry( .5, .5, 0, false ),
		new THREE.MeshBasicMaterial({ 
			color: color,
			transparent : true,
		})
	)
	indicator.position.y = earthRadius
	marker.position.y = earthRadius

	group1.add( indicator )
	group2.add( group1 )
	group1.add( marker )
	group1.rotation.x = ( 90 - latitude  ).degreesToRadians()
	group2.add( group1 )
	group2.rotation.y = ( 90 + longitude ).degreesToRadians()

	group2.tweet = tweet
	group2.geo = { lat : latitude, lon : longitude }
	group2.dead = false

	group2.fadeMarker = function(){
		if ( this.children[0].children[1].material.opacity > 0 ){
		
			this.children[0].children[1].material.opacity -= .01

		} else {

			this.dead = true 

		}
	}

	group2.fadeIndicator = function(){
		if ( this.children[0].children[0].material.opacity > .5 ){
		
			this.children[0].children[0].material.opacity -= .03

		}
	} 

	group2.spike = function(){
		if ( this.children[0].children[1].scale.y < 3 && !this.dead) {

			this.children[0].children[1].scale.y += .8
			// console.log(this.children[1].children[1].scale.y)

		}

	}

	// console.log(scene)

	return group2
}




//  Why separate this simple line of code from the loop() function?
//  So that our controls can also call it separately.

function render(){

	renderer.render( scene, camera )
}




//  I'll leave this in for the moment for reference, but it seems to be
//  having some issues ...

function surfacePlot( params ){

	params = cascade( params, {} )
	params.latitude  = cascade( params.latitude.degreesToRadians(),  0 )
	params.longitude = cascade( params.longitude.degreesToRadians(), 0 )
	params.center    = cascade( params.center, new THREE.Vector3( 0, 0, 0 ))
	params.radius    = cascade( params.radius, 60 )

	var
	x = params.center.x + params.latitude.cosine() * params.longitude.cosine() * params.radius,
	y = params.center.y + params.latitude.cosine() * params.longitude.sine()   * params.radius,
	z = params.center.z + params.latitude.sine()   * params.radius

	return new THREE.Vector3( x, y, z )
}




function setupThree(){
	
	
	//  First let's create a Scene object.
	//  This is what every other object (like shapes and even lights)
	//  will be attached to.
	//  Notice how our scope is inside this function, setupThree(),
	//  but we attach our new variable to the Window object
	//  in order to make it global and accessible to everyone.

	//  An alterative way to do this is to declare the variables in the 
	//  global scope--which you can see in the example here:
	//  https://github.com/mrdoob/three.js/
	//  But this feels more compact and contained, no?
	
	window.scene = new THREE.Scene()

	scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

	//  And now let's create a Camera object to look at our Scene.
	//  In order to do that we need to think about some variable first
	//  that will define the dimensions of our Camera's view.
	
	var
	WIDTH      = window.innerWidth,
	HEIGHT     = window.innerHeight,
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 10000
	
	window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
	camera.position.set( 0, 0, 600 )
	camera.lookAt( scene.position )
	scene.add( camera )


	//  Finally, create a Renderer to render the Scene we're looking at.
	//  A renderer paints our Scene onto an HTML5 Canvas from the perspective 
	//  of our Camera.
	
	window.renderer = new THREE.WebGLRenderer({ antialias: true })
	//window.renderer = new THREE.CanvasRenderer({ antialias: true })
	renderer.setSize( WIDTH, HEIGHT )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true


	//  In previous examples I've used the direct JavaScript syntax of
	//  document.getElementById( 'three' ).appendChild( renderer.domElement )
	//  but now that we're using the jQuery library in this example we can
	//  take advantage of it:	

	$( '#three' ).append( renderer.domElement )
	
}




function addControls(){

	window.controls = new THREE.TrackballControls( camera )

	controls.rotateSpeed = 1.0
	controls.zoomSpeed   = 1.2
	controls.panSpeed    = 0.8

	controls.noZoom = false
	controls.noPan  = false
	controls.staticMoving = true
	controls.dynamicDampingFactor = 0.3
	controls.keys = [ 65, 83, 68 ]//  ASCII values for A, S, and D

	controls.addEventListener( 'change', render )
}




function addLights(){
	
	var
	ambient,
	directional
	
	// //  Let's create an Ambient light so that even the dark side of the 
	// //  earth will be a bit visible. 
	
	ambient = new THREE.AmbientLight( 0x666666 )
	scene.add( ambient )	
	
	
	// //  Now let's create a Directional light as our pretend sunshine.
	
	directional = new THREE.DirectionalLight( 0xCCCCCC )
	directional.castShadow = true	
	scene.add( directional )

	// var dirLight,
	// 	ambientLight

	// dirLight = new THREE.DirectionalLight( 0xffffff );
	// dirLight.position.set( -1, 0, 1 ).normalize();
	// scene.add( dirLight );

	// ambientLight = new THREE.AmbientLight( 0x000000 );
	// scene.add( ambientLight );


	//  Those lines above are enough to create another working light.
	//  But we just can't leave well enough alone.
	//  Check out some of these options properties we can play with.

	directional.position.set( 100, 200, 300 )
	directional.target.position.copy( scene.position )
	directional.shadowCameraTop     =  600
	directional.shadowCameraRight   =  600
	directional.shadowCameraBottom  = -600
	directional.shadowCameraLeft    = -600
	directional.shadowCameraNear    =  300
	directional.shadowCameraFar     = -600
	directional.shadowBias          =   -0.0001
	directional.shadowDarkness      =    0.3
	directional.shadowMapWidth      = directional.shadowMapHeight = 2048
	//directional.shadowCameraVisible = true
}

function addStars(){
					// stars

				var i, r = 300, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

				for ( i = 0; i < 250; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );

					starsGeometry[ 0 ].vertices.push( vertex );

				}

				for ( i = 0; i < 1500; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );

					starsGeometry[ 1 ].vertices.push( vertex );

				}

				var stars;
				var starsMaterials = [
					new THREE.ParticleBasicMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
					new THREE.ParticleBasicMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
					new THREE.ParticleBasicMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
					new THREE.ParticleBasicMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
					new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
					new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
				];

				for ( i = 10; i < 30; i ++ ) {

					stars = new THREE.ParticleSystem( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

					stars.rotation.x = Math.random() * 6;
					stars.rotation.y = Math.random() * 6;
					stars.rotation.z = Math.random() * 6;

					s = i * 10;
					stars.scale.set( s, s, s );

					stars.matrixAutoUpdate = false;
					stars.updateMatrix();

					scene.add( stars );

				}
}



