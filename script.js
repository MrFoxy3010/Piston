//----------------------------Variables----------------------------
//Molecules
var molecules = [], 
	molecules_count = 10, 
	molecules_radius = 1, 
	dy_piston = 1, 
	motion_piston = 100, 
	size_piston = 0,
	checkDraw = false;

//Settings Canvas
var backgroundColorPiston = '#968383',
	colorPiston = '#0f0d0d',
	colorMolecule = '#0f2e7d';
//-----------------------------------------------------------------



//----------------------Canvas Initialization----------------------
var canvas = document.getElementById('simulation'),
    ctx  = canvas.getContext('2d');

canvas.height = document.getElementById('simulation').offsetHeight;
canvas.width = document.getElementById('simulation').offsetWidth;

ctx.fillStyle = backgroundColorPiston;
ctx.fillRect(0, 0, canvas.width, canvas.height); 
//-----------------------------------------------------------------




function startSimulation(){
	state_simulation = !state_simulation;
	if(state_simulation){
		document.getElementById("btn_start").style.backgroundColor = "red";
		document.getElementById("btn_start").innerHTML = "Стоп";
		piston_size = 0;
		molecules = [];
	    for (let j = 0; j < molecules_count; j++) molecules[j] = new OrbitalFG();
	    clearChart();
	    if(checkDraw == false) drawSimulation();
	}
	else{
		document.getElementById("btn_start").style.backgroundColor = "rgb(80, 134, 189)";
		document.getElementById("btn_start").innerHTML = "Старт";
		removeData(graphVelocityChart);
		removeData(graphVelChart);
	}
}

function pauseSimulation(){
	state_pause = !state_pause;
	if(!state_pause){
		document.getElementById("btn_pause").innerHTML = btn_pause;
	}
	else{
		document.getElementById("btn_pause").innerHTML = btn_play;
		if(checkDraw == false) drawSimulation();
	}
}

function drawSimulation(){ 
	if(document.getElementById("movement_piston").value == 'move' && state_pause){
		if(size_piston < motion_piston && dy_piston == 1) size_piston += dy_piston;
		else {
			dy_piston = -1;
			if(size_piston > 0 && dy_piston == -1) size_piston += dy_piston;
			else dy_piston = 1;
		}
	}
	if(document.getElementById('type_modeling').value == 'modeling') {
		ctx.fillStyle = backgroundColorPiston;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = colorPiston;
		ctx.fillRect(0, 0, canvas.width, size_piston); 	
		ctx.fillRect(0, canvas.height - size_piston, canvas.width, canvas.height); 
	}
	if(document.getElementById("movement_piston").value != 'move') {
		piston_size = 0;
		ctx.fillStyle = backgroundColorPiston;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	if(molecules.length > molecules_count){
		for (let j = 0; j < molecules.length-molecules_count; j++) molecules.pop();
	}
	if(molecules.length < molecules_count){
		for (let j = molecules.length; j < molecules_count; j++) molecules[j] = new OrbitalFG();
	}

    for (let k = 0; k < molecules_count; k++) {
    	if(state_pause) molecules[k].update();
    	molecules[k].edges();
        if(document.getElementById('type_modeling').value == 'modeling') molecules[k].display();
    }

    if(state_simulation && state_pause) { checkDraw = true; requestAnimationFrame(drawSimulation); }
    else {
		checkDraw = false;
		return;
    }
}

function OrbitalFG() {
    this.x = random(10, canvas.width - 10);
	this.y = random(10, canvas.height - 10);
    this.dx = random(-10, 12) / molecules_radius;
    this.dy = random(-10, 12) / molecules_radius;
    this.update = function() {
    	if(this.x == NaN || this.y == NaN || this.dx == NaN || this.dy == NaN) this.checkMolecule();
        this.x += this.dx;
        this.y += this.dy;
    };
    this.checkMolecule = function(){
    	this.x = random(molecules_radius, canvas.width - molecules_radius);
		this.y = random(molecules_radius, canvas.height - molecules_radius);
    	this.dx = random(-12, 12) / molecules_radius;
    	this.dy = random(-12, 12) / molecules_radius;  	
    }
    this.display = function() {
    	ctx.beginPath();
        ctx.fillStyle = colorMolecule;
        ctx.arc(this.x, this.y, molecules_radius, 0, 2*Math.PI, false);
        ctx.fill();
    };
    this.edges = function() {
    	for(let i = 0; i < molecules_count; i++) {
            let dx = this.x - molecules[i].x,
            	dy = this.y - molecules[i].y,
            	d = Math.sqrt(dx*dx + dy*dy),
            	dsin = dx / d, dcos = dy / d;

            if(d < 2*molecules_radius && this != molecules[i]) {
            	let vn1 = molecules[i].dx * dsin + molecules[i].dy * dcos;
            		vn2 = this.dx * dsin + this.dy * dcos,
            		vt1 = -molecules[i].dx * dcos + molecules[i].dy * dsin,
            		vt2 = -this.dx * dcos + this.dy * dsin,
            		dt = (2*molecules_radius - d) / (vn1 - vn2);
            	if(dt > 0.6) dt = 0.6;
            	if(dt < -0.6) dt = -0.6;
            	this.x -= this.dx * dt;
            	this.y -= this.dy * dt;
            	molecules[i].x -= molecules[i].dx * dt;
            	molecules[i].y -= molecules[i].dx * dt;
            	dx = this.x - molecules[i].x, dy = this.y - molecules[i].y;

            	this.dx = vn1 * dsin - vt2 * dcos;
            	this.dy = vn1 * dcos + vt2 * dsin;
            	molecules[i].dx = vn2 * dsin - vt1 * dcos;
            	molecules[i].dy = vn2 * dcos + vt1 * dsin;
            }
    	}
        if(molecules_radius + this.x > canvas.width) 
        {
        	this.dx *= -1;
        	this.x = canvas.width - molecules_radius;
        }
        if(-molecules_radius + this.x < 0) 
        {
        	this.dx *= -1;
        	this.x = molecules_radius;
        }
        if(document.getElementById("movement_piston").value == 'move'){
	        if(molecules_radius + this.y > canvas.height - size_piston) {
	           	this.dy = -2*dy_piston - this.dy;
	           	this.y = canvas.height - size_piston - molecules_radius;
	        }
	        if(-molecules_radius + this.y < size_piston) {
				this.dy = 2*dy_piston - this.dy;
				this.y = size_piston + molecules_radius;
	        }
    	}
    	else{
	        if(molecules_radius + this.y > canvas.height) this.dy *= -1;
	        if(-molecules_radius + this.y < 0) this.dy *= -1;  		
    	}
    };
}

function changesMolecules(){
	if(!state_pause) drawSimulation();
	clearChart();
}