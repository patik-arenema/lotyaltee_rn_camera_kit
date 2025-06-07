import {Controller} from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {Eye, EyeOff} from 'lucide-react-native';

const InputField = ({
  control,
  name,
  placeholder,
  icon,
  secureTextEntry,
  toggleSecure,
  error,
}: any) => {
  return (
    <>
      <View style={styles.inputContainer}>
        {icon}
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="gray"
            />
          )}
        />
        {toggleSecure && (
          <TouchableOpacity onPress={toggleSecure}>
            {secureTextEntry ? (
              <EyeOff size={20} color="gray" />
            ) : (
              <Eye size={20} color="gray" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 20},
  scroll: {flexGrow: 1, justifyContent: 'center'},
  logo: {width: 180, height: 180, alignSelf: 'center', marginBottom: 0},
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    marginTop: 10,
    color: '#000',
    fontFamily: fonts.regular,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default InputField;
