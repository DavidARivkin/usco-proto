DistanceArrowHelper = function(options)
{
  var options = options || {};
  var length = this.length = options.length || 50;

  var crossSize = 10;
 
  var text = this.text = options.text || this.length;
  var textSize = options.textSize || 10;

  THREE.Object3D.call( this );
  
  //starting point cross
  var startCrossGeometry = new THREE.Geometry();
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, -crossSize/2, 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, crossSize/2 , 0 ) );
  
  startCrossGeometry.vertices.push( new THREE.Vector3( -crossSize/2, 0, 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( crossSize/2, 0 , 0 ) );
  
  this.startCross = new THREE.Line( startCrossGeometry, new THREE.LineBasicMaterial( { color: 0x000000,depthTest:false,depthWrite:false,renderDepth : 1e20, opacity:0.4, transparent:true } ),THREE.LinePieces );
  this.add( this.startCross ) ;
  
  //main arrow
  this.arrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0 ) , length ,0x000000, 4, 2);
  this.arrow.scale.z =0.1;
  this.add( this.arrow ) ;
  
  //length label
  this.label = new LabelHelper3d({text:this.text,fontSize:this.textSize});
  this.label.position.x = length/2;
  
  this.add( this.label );
}

DistanceArrowHelper.prototype = Object.create( THREE.Object3D.prototype );

/*
  Made of two main arrows, and two lines perpendicular to the main arrow, at both its ends
  If the VISUAL distance between star & end of the helper is too short to fit text + arrow:
   * arrows should be on the outside
   * if text does not fit either, offset it to the side
*/
SizeArrowHelper = function(options)
{
  var options = options || {}
  
  //Todo : auto adjust arrows : if not enough space, arrows shoud be outside
  THREE.Object3D.call( this );
  this.up = new THREE.Vector3(0,0,1);
  //this.start = start;
  //this.end = end;

  var position = options.position || new THREE.Vector3();
  var direction = this.direction = options.direction || new THREE.Vector3();
  var length = this.length = options.length || 10;
  this.color = options.color || "#000000" ;
  
  this.text = options.text || this.length;
  var textSize = options.textSize || 8;
  
  var sideLength = options.sideLength || 3;
  var sideLengthExtra = options.sideLengthExtra || 2;
  var drawSideLines = options.drawSideLines || true;
  
  //var arrowStart = options.arrowStart|| true;
  //var arrowEnd = options.arrowEnd || true;


  if( drawSideLines )
  {
    var sideLineGeometry = new THREE.Geometry();
    sideLineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    sideLineGeometry.vertices.push( new THREE.Vector3( 0, sideLength+sideLengthExtra , 0 ) );
    
    var leftSideLine = new THREE.Line( sideLineGeometry, new THREE.LineBasicMaterial( { color: 0x000000,depthTest:false,depthWrite:false,renderDepth : 1e20, opacity:0.4, transparent:true } ) );
    leftSideLine.position.x = -this.length / 2;

    var rightSideLine = leftSideLine.clone();
    rightSideLine.position.x = this.length / 2;
    
    this.add( rightSideLine );
    this.add( leftSideLine );
  }
    
  var leftArrowDir = new THREE.Vector3(1,0,0);
  var rightArrowDir = new THREE.Vector3(-1,0,0);
  var leftArrowPos = new THREE.Vector3(0,sideLength,0);
  var rightArrowPos = new THREE.Vector3(0,sideLength,0);
  var arrowHeadSize = 4;
  var arrowSize = length/2;
  //draw dimention / text
  //var labelPosition = new THREE.Vector3(0,
  this.label = new LabelHelperPlane({text:this.text,fontSize:this.textSize});
  this.label.position.y = sideLength;
  this.label.rotation.z = Math.PI;
  
  var labelWidth = this.label.width;
  var length = this.length;
  var reqWith = labelWidth + 2*arrowHeadSize;
  console.log("labelWidth",labelWidth, reqWith, length);
  
  if(reqWith>length)
  {
    arrowSize = Math.max(length/2,6);//we want arrows to be more than just arrowhead in all the cases
    var arrowXPos = length/2+arrowSize;
  
    leftArrowDir = new THREE.Vector3(-1,0,0);
    rightArrowDir = new THREE.Vector3(1,0,0);
    leftArrowPos = new THREE.Vector3(arrowXPos,sideLength,0);
    rightArrowPos = new THREE.Vector3(-arrowXPos,sideLength,0);
    if(labelWidth>length)//if even the label itself does not fit
    {
      this.label.position.y += 5;
    }
  }
  
  this.add( this.label );
  
  //direction, origin, length, color, headLength, headRadius, headColor
  var mainArrowLeft = new THREE.ArrowHelper(leftArrowDir,leftArrowPos,arrowSize, this.color,arrowHeadSize, 2);
  var mainArrowRight = new THREE.ArrowHelper(rightArrowDir,rightArrowPos,arrowSize, this.color,arrowHeadSize, 2);
  mainArrowLeft.scale.z =0.1;
  mainArrowRight.scale.z=0.1;
  this.add( mainArrowLeft );
  this.add( mainArrowRight );
  
  
  //general attributes
  this.position = position; 
  var angle = new THREE.Vector3(1,0,0).angleTo(direction); //new THREE.Vector3(1,0,0).cross( direction );
  this.setRotationFromAxisAngle(direction,angle);

  //leftSideLine.renderDepth = 1e20;
  //rightSideLine.renderDepth = 1e20;

  mainArrowRight.renderDepth = 1e20;
  mainArrowRight.cone.material.depthTest=false;
  mainArrowRight.cone.material.depthWrite=false;
  mainArrowRight.line.material.depthTest=false;
  mainArrowRight.line.material.depthWrite=false;
  
  mainArrowLeft.renderDepth = 1e20;
  mainArrowLeft.cone.material.depthTest=false;
  mainArrowLeft.cone.material.depthWrite=false;
  mainArrowLeft.line.material.depthTest=false;
  mainArrowLeft.line.material.depthWrite=false;
}

SizeArrowHelper.prototype = Object.create( THREE.Object3D.prototype );


/*
  Made of one main arrow, and two lines perpendicular to the main arrow, at both its ends
*/
DiameterHelper = function(diameter, distance, endLength, color)
{
  THREE.Object3D.call( this );

  this.distance = distance || 30;
  this.diameter = diameter || 20;
  this.endLength = endLength || 20;
  this.color = color || "#000000" ;
  this.text = this.diameter;

  var material = new THREE.LineBasicMaterial( { color: 0x000000, depthTest:false,depthWrite:false,renderDepth : 1e20});
 
  //center cross
  var centerCrossSize = 10;
  var centerCrossGeometry1 = new THREE.Geometry();
  centerCrossGeometry1.vertices.push( new THREE.Vector3( -centerCrossSize, 0, 0 ) );
  centerCrossGeometry1.vertices.push( new THREE.Vector3( centerCrossSize, 0, 0 ) );
  var centerCrossGeometry2 = new THREE.Geometry();
  centerCrossGeometry2.vertices.push( new THREE.Vector3( 0, -centerCrossSize, 0 ) );
  centerCrossGeometry2.vertices.push( new THREE.Vector3( 0, centerCrossSize, 0 ) );
  var centerCross1 = new THREE.Line( centerCrossGeometry1, material );
  var centerCross2 = new THREE.Line( centerCrossGeometry2, material );

  //draw arrow
  var arrowOffset = new THREE.Vector3(Math.sqrt(this.distance)*2+this.diameter/2,Math.sqrt(this.distance)*2+this.diameter/2,0);
  var mainArrow = new THREE.ArrowHelper2(new THREE.Vector3(-1,-1,0),new THREE.Vector3(),this.distance , this.color);
  mainArrow.position.add(arrowOffset);

  var endLineEndPoint = arrowOffset.clone().add( new THREE.Vector3( this.endLength, 0, 0 ) ) ;
  var endLineGeometry = new THREE.Geometry();
  endLineGeometry.vertices.push( arrowOffset );
  endLineGeometry.vertices.push( endLineEndPoint ); 
   var endLine = new THREE.Line( endLineGeometry, material );

  //draw dimention / text
  this.label = new THREE.TextDrawHelper().drawTextOnPlane(this.text,45);
  this.label.position.add( endLineEndPoint );
  //TODO: account for size of text instead of these hacks
  this.label.position.x += 5
  this.label.position.y -= 2
  
  
  //draw main circle
  var circleRadius = this.diameter/2;
  var circleShape = new THREE.Shape();
	circleShape.moveTo( 0, 0 );
	circleShape.absarc( 0, 0, circleRadius, 0, Math.PI*2, false );
  var points  = circleShape.createSpacedPointsGeometry( 100 );
  var diaCircle = new THREE.Line(points, material );

  //add all
  this.add( diaCircle );
  this.add( mainArrow );
  this.add( endLine );
  this.add( this.label );
  this.add( centerCross1 );
  this.add( centerCross2 );
}

DiameterHelper.prototype = Object.create( THREE.Object3D.prototype );


/*----------------------------------------------*/

ObjectDimensionsHelper = function (options) {
  THREE.Object3D.call( this );
  var options = options || {};
  var color = options.color || 0x000000;
  var mesh = options.mesh || this.parent || null;

  var cage = new THREE.Object3D()
  var lineMat = new THREE.MeshBasicMaterial({color: color, wireframe: true, shading:THREE.FlatShading});

  //console.log("mesh",mesh)

  this.getBounds(mesh);
  var delta = this.computeMiddlePoint(mesh);
  cage.position = delta
  
  var widthArrowPos = new THREE.Vector3(delta.x+this.length/2,delta.y,delta.z-this.height/2); 
  var lengthArrowPos = new THREE.Vector3( delta.x, delta.y+this.width/2, delta.z-this.height/2)
  var heightArrowPos = new THREE.Vector3( delta.x-this.length/2,delta.y+this.width/2,delta.z)

  //console.log("width", this.width, "length", this.length, "height", this.height,"delta",delta, "widthArrowPos", widthArrowPos)

  dashMaterial = new THREE.LineDashedMaterial( { color: 0x000000, dashSize: 2.5, gapSize: 2, depthTest: false,linewidth:1} )
  baseCubeGeom = new THREE.CubeGeometry(this.length, this.width,this.height)

  var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-this.length/2, -this.width/2, 0));
    geometry.vertices.push(new THREE.Vector3(this.length/2, -this.width/2, 0));
    geometry.vertices.push(new THREE.Vector3(this.length/2, this.width/2, 0));
    geometry.vertices.push(new THREE.Vector3(-this.length/2, this.width/2, 0));
    geometry.vertices.push(new THREE.Vector3(-this.length/2, -this.width/2, 0));
    
  
  geometry.computeLineDistances();

  var baseOutline = new THREE.Line( geometry, dashMaterial, THREE.Lines );
  baseOutline.renderDepth = 1e20
  baseOutline.position = new THREE.Vector3(delta.x,delta.y,delta.z-this.height/2)
  this.add(baseOutline);


  var bla = new THREE.Mesh(baseCubeGeom,new THREE.MeshBasicMaterial({wireframe:true,color:0xff0000}))
  bla.position = new THREE.Vector3(delta.x,delta.y,delta.z);
  //this.add( bla )

  var sideLength =10;
  
  //length, sideLength, position, direction, color, text, textSize,
  var widthArrow = new SizeArrowHelper({length:this.width,sideLength:sideLength,position:widthArrowPos,direction:new THREE.Vector3(0,0,-1) });

  var lengthArrow = new SizeArrowHelper(  {length:this.length,sideLength:sideLength,position:lengthArrowPos,direction:new THREE.Vector3(1,0,0) });

  var heightArrow = new SizeArrowHelper(  {length:this.height,sideLength:sideLength,position:heightArrowPos,direction:new THREE.Vector3(0,1,0) });
        
  this.add( widthArrow );
  this.add( lengthArrow );
  this.add( heightArrow );

}

ObjectDimensionsHelper.prototype = Object.create( THREE.Object3D.prototype );

ObjectDimensionsHelper.prototype.computeMiddlePoint=function(mesh)
{
  var middle  = new THREE.Vector3()
  middle.x  = ( mesh.boundingBox.max.x + mesh.boundingBox.min.x ) / 2;
  middle.y  = ( mesh.boundingBox.max.y + mesh.boundingBox.min.y ) / 2;
  middle.z  = ( mesh.boundingBox.max.z + mesh.boundingBox.min.z ) / 2;
  //console.log("mid",geometry.boundingBox.max.z,geometry.boundingBox.min.z, geometry.boundingBox.max.z+geometry.boundingBox.min.z)
  return middle;
}

ObjectDimensionsHelper.prototype.getBounds=function(mesh)
{
  if( !(mesh.boundingBox))
  {
    //TODO: "meshes" should have bounding box/sphere informations, not just shapes/geometries should have it
      mesh.boundingBox = computeObject3DBoundingBox(mesh);
  }
  var bbox = mesh.boundingBox;

  var length = (bbox.max.x-bbox.min.x).toFixed(2);
  var width  = (bbox.max.y-bbox.min.y).toFixed(2);
  var height = (bbox.max.z-bbox.min.z).toFixed(2);

  this.width = width;
  this.height = height;
  this.length = length;

  return [length,width, height];
}
          
