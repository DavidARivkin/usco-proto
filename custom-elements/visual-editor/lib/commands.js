//operation "class"
Command = function ( type, value, target)
{
  this.type = type;
  this.value = value;
  this.target = target;
}

Translation = function ( value, target)
{
  Command.call( this );
  this.type = "translation";
  this.value = value;
  this.target = target;
}
Translation.prototype = Object.create( Command.prototype );
Translation.prototype.constructor=Translation;

/*Not sure about this
Translation.prototype.execute = function(value)
{
    this.target.position.add(value);
}*/

Translation.prototype.undo = function()
{
    this.target.position.sub(this.value);
}

Translation.prototype.redo = function()
{
    this.target.position.add(this.value);
}

Rotation = function ( value, target)
{
  Command.call( this );
  this.type = "rotation";
  this.value = value;
  this.target = target;
}
Rotation.prototype = Object.create( Command.prototype );
Rotation.prototype.constructor=Rotation;

Rotation.prototype.undo = function()
{
    //this.target.position.sub(this.value);
    this.target.rotation.x -= this.value.x;
    this.target.rotation.y -= this.value.y;
    this.target.rotation.z -= this.value.z;
}

Rotation.prototype.redo = function()
{
    this.target.rotation.x += this.value.x;
    this.target.rotation.y += this.value.y;
    this.target.rotation.z += this.value.z;
}

Scaling = function ( value, target)
{
  Command.call( this );
  this.type = "scaling";
  this.value = value;
  this.target = target;
}
Scaling.prototype = Object.create( Command.prototype );
Scaling.prototype.constructor=Scaling;

Scaling.prototype.undo = function()
{
  this.target.scale.x -= this.value.x;
  this.target.scale.y -= this.value.y;
  this.target.scale.z -= this.value.z;
}

Scaling.prototype.redo = function()
{
  this.target.scale.x += this.value.x;
  this.target.scale.y += this.value.y;
  this.target.scale.z += this.value.z;
}


//FIXME: HAAACK !
Subtraction = function ( target,originalGeometry)
{
  Command.call( this );
  this.type = "Subtraction";
  this.target = target;
  this.original = originalGeometry;

  this._undoBackup = null;
}
Subtraction.prototype = Object.create( Command.prototype );
Subtraction.prototype.constructor=Subtraction;

Subtraction.prototype.undo = function()
{
  var target = this.target;
  this._undoBackup = target.innerMesh.geometry;
  var pos = target.innerMesh.position.clone();
  target.shape.remove( target.innerMesh);
  target.innerMesh = new THREE.Mesh(this.original, target.material);
  target.shape.add( target.innerMesh);
  target.innerMesh.position=pos;
  target.dispatchEvent( { type: 'shapeChanged' } );
}
Subtraction.prototype.redo = function()
{
  var target = this.target;
  var pos = target.innerMesh.position.clone();
  target.shape.remove( target.innerMesh);
  target.innerMesh = new THREE.Mesh(this._undoBackup, target.material);
  target.shape.add( target.innerMesh);
  target.innerMesh.position=pos;
  target.dispatchEvent( { type: 'shapeChanged' } );
}


Creation = function (target, parentObject)
{
  Command.call( this );
  this.type = "creation";
  this.target = target;
  this.parentObject = parentObject;
}
Creation.prototype = Object.create( Command.prototype );
Creation.prototype.constructor=Creation;

Creation.prototype.undo = function()
{
    this.parentObject.remove(this.target);
}

Creation.prototype.redo = function()
{
  this.parentObject.add(this.target);
}


Deletion = function (target, parentObject)
{
  Command.call( this );
  this.type = "deletion";
  this.target = target;
  this.parentObject = parentObject;
}
Deletion.prototype = Object.create( Command.prototype );
Deletion.prototype.constructor=Deletion;

Deletion.prototype.undo = function()
{
    this.parentObject.add(this.target);
}

Deletion.prototype.redo = function()
{
  this.parentObject.remove(this.target);
}
