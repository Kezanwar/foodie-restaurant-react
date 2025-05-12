const ignoreProps = (...props) => {
    return p => !props.includes(p);
};

export default ignoreProps;
