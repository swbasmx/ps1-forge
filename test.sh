export PS1='$(echo hello)'
echo "With NO backslash:"
bash --rcfile /dev/null -i -c 'echo ""'
export PS1='\$(echo hello)'
echo "With backslash:"
bash --rcfile /dev/null -i -c 'echo ""'
