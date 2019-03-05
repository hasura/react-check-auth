import {useContext} from 'react';
import {AuthContext} from './context';

export default function useCheckAuth () {
  return useContext(AuthContext)
}
