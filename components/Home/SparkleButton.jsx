import { Pressable, Text, View,Link } from 'react-native';

const SparkleButton = () => {
  return (
    <Link to="/AddPet">
      <Pressable
        className="bg-blue-500 p-4 rounded-full relative flex items-center justify-center shadow-lg"
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'hsl(260, 97%, 61%)' : 'hsl(260, 97%, 70%)',
            transform: [{ scale: pressed ? 1 : 1.1 }],
          },
          pressed && {
            shadowColor: 'hsl(260, 97%, 61%)',
            shadowOffset: { width: 0, height: pressed ? 15 : 10 },
            shadowOpacity: 0.75,
            shadowRadius: pressed ? 30 : 20,
          },
        ]}
      >
        <View className="absolute inset-0 rounded-full border border-indigo-500 opacity-75" />
        <View className="flex flex-row items-center gap-1">
          {/* SVG or Icon goes here */}
          <Text className="text-white text-xl font-medium">Generate Site</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default SparkleButton;
