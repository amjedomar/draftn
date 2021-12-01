import BoldIcon from '../icons/BoldIcon';
import ItalicIcon from '../icons/ItalicIcon';
import UnderlinedIcon from '../icons/UnderlinedIcon';
import StrikethroughIcon from '../icons/StrikethroughIcon';
import BlockquoteIcon from '../icons/BlockquoteIcon';
import OrderedListIcon from '../icons/OrderedListIcon';
import UnorderedListIcon from '../icons/UnorderedListIcon';
import HeaderTwoIcon from '../icons/HeaderTwoIcon';
import HeaderThreeIcon from '../icons/HeaderThreeIcon';

export const inlineStyleButtons = [
  { type: 'BOLD', icon: <BoldIcon />, title: 'Ctrl+B' },
  { type: 'ITALIC', icon: <ItalicIcon />, title: 'Ctrl+I' },
  { type: 'UNDERLINE', icon: <UnderlinedIcon />, title: 'Ctrl+U' },
  { type: 'STRIKETHROUGH', icon: <StrikethroughIcon />, title: 'Ctrl+S' },
];

export const blockTypeButtons = [
  { type: 'header-two', icon: <HeaderTwoIcon />, title: 'Ctrl+2' },
  { type: 'header-three', icon: <HeaderThreeIcon />, title: 'Ctrl+3' },
  { type: 'ordered-list-item', icon: <OrderedListIcon />, title: 'Ctrl+7' },
  { type: 'unordered-list-item', icon: <UnorderedListIcon />, title: 'Ctrl+8' },
  { type: 'blockquote', icon: <BlockquoteIcon />, title: 'Ctrl+Q' },
];
