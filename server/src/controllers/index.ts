import {catchErrors} from "../errors/catchErrors";

export const discovery = catchErrors(async (req, res) => {
    res.json('success');
}, 'Failed to get discovery');