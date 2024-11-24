import {
  FaCcVisa,
  FaCcAmex,
  FaCcDiscover,
  FaCcDinersClub,
  FaCcJcb
} from 'react-icons/fa';
import { RiMastercardLine } from 'react-icons/ri';
import {
  SiAmericanexpress,
  SiApplepay,
  SiDinersclub,
  SiDiscover,
  SiJcb
} from 'react-icons/si';
import { MdCreditCard } from 'react-icons/md';

export const cardBrandIcons = {
  visa: FaCcVisa,
  mastercard: RiMastercardLine,
  'american express': SiAmericanexpress,
  discover: SiDiscover,
  diners: SiDinersclub,
  jcb: SiJcb,
  'apple pay': SiApplepay,
  default: MdCreditCard
};

export const cardBrandColors = {
  visa: '#1a1f71', // Visa blue
  mastercard: '#eb2300', // MasterCard red
  'american express': '#2e77bc', // AmEx blue
  discover: '#ff6000', // Discover orange
  diners: '#0065a4', // Diners Club blue
  jcb: '#0071bc', // JCB blue
  'apple pay': '#000000', // Black for Apple Pay
  maestro: '#cc0000', // Maestro red
  unionpay: '#007749', // UnionPay green
  switch: '#0055a5', // Switch blue
  default: '#090909' // Default light gray
};
