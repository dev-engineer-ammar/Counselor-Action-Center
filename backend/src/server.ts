import express from 'express';
import cors from 'cors';
import { AppContainer } from './container';
import { errorHandler } from './middleware/errorHandler';
import { requestContext } from './middleware/requestContext';
import { requestLogger } from './middleware/requestLogger';

export const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(requestContext);
app.use(requestLogger);
app.use(express.json());

// Wire the fully resolved router object straight from the DI container
app.use('/api', AppContainer.studentRouter);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });
}
