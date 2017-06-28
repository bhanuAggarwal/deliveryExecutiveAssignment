import values from 'lodash/values';

const STATUS = {
	NEW : 'NEW',
	ASSIGNED : 'ASSIGNED',
	CANCELLED : 'CANCELLED'
};

export const options = values(STATUS);

export default STATUS;
