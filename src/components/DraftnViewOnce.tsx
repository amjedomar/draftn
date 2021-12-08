import { memo } from 'react';
import DraftnView, { DraftnViewProps } from './DraftnView';

const DraftnViewOnce = (props: DraftnViewProps) => <DraftnView {...props} />;

const propsAreEqual = () => true;

export default memo(DraftnViewOnce, propsAreEqual);
