//UTILS

//set quad color
const QuadColor = (quad, color) => {
	quad.tintTopLeft = color;
	quad.tintTopRight = color;
	quad.tintBottomLeft = color;
	quad.tintBottomRight = color;
};

//math helper utility
const normalise = (velocity) => {
	const mag = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2));
	mag !== 0 ? (velocity.x /= mag) : (velocity.y = 0);
	mag !== 0 ? (velocity.y /= mag) : (velocity.y = 0);

	return velocity;
};

const FADE_DURATION = 500;
