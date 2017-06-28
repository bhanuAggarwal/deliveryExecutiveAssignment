import values from 'lodash/values';

const STATUS = {
	ASSIGNED : 'ASSIGNED',
	AVAILABLE : 'AVAILABLE'
};

export const options = values(STATUS);

export default STATUS;
