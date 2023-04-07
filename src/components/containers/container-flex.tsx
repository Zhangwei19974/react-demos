import React, {PropsWithChildren} from 'react';
import main from '@/styles/main.module.css'

interface IProps{
  style?:React.CSSProperties
}

function ContainerFlex(props:PropsWithChildren<IProps>) {
  console.log(props.children)
  return (
    <div className={`${main.flex} ${main.fixScreen} ${main.relative}`} style={{}}>
      {props.children}
    </div>
  );
}

export default ContainerFlex;
