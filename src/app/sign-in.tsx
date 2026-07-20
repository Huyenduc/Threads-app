import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { authUserAtom } from "@/state/global";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOOGLE_WEB_CLIENT_ID =
  "210248619580-jopdae58n4g4kmpg3n8p2hlrn2mb4qom.apps.googleusercontent.com";

export default function SignInScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const setAuthUser = useSetAtom(authUserAtom);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ["profile", "email"],
      profileImageSize: 160,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsSigningIn(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();

      if (response.type === "cancelled") {
        return;
      }

      setAuthUser({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        photo: response.data.user.photo,
      });
      router.replace("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMessage("Could not sign in with Google. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.hero}>
        <View
          style={[
            styles.logoWrap,
            {
              backgroundColor: isDark ? "#1c1c1e" : "#f4f4f5",
              borderColor: colors.border,
            },
          ]}
        >
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Threads</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Sign in to continue your conversations, posts, and profile.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={isSigningIn}
          onPress={handleGoogleSignIn}
          style={({ pressed }) => [
            styles.googleButton,
            {
              backgroundColor: isDark ? "#ffffff" : "#11181c",
              opacity: pressed || isSigningIn ? 0.82 : 1,
            },
          ]}
        >
          <View style={styles.googleIconWrap}>
            {isSigningIn ? (
              <ActivityIndicator color="#4285f4" size="small" />
            ) : (
              <FontAwesome name="google" size={20} color="#4285f4" />
            )}
          </View>
          <Text
            style={[
              styles.googleButtonText,
              { color: isDark ? "#11181c" : "#ffffff" },
            ]}
          >
            {isSigningIn ? "Signing in..." : "Continue with Google"}
          </Text>
        </Pressable>

        {errorMessage ? (
          <Text style={[styles.errorText, { color: "#ef4444" }]}>
            {errorMessage}
          </Text>
        ) : null}

        <Text style={[styles.terms, { color: colors.icon }]}>
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
  },
  logoWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    marginBottom: 28,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 14,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 310,
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  actions: {
    gap: 18,
  },
  googleButton: {
    minHeight: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
  },
  googleIconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  terms: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
