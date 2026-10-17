package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val FinoraDarkColorScheme = darkColorScheme(
    primary = MetallicGold,
    onPrimary = DeepNavy,
    primaryContainer = RoyalNavy,
    onPrimaryContainer = SoftGold,
    secondary = SoftGold,
    onSecondary = DeepNavy,
    secondaryContainer = DarkElevatedSurface,
    onSecondaryContainer = DarkText,
    tertiary = FinancialPositive,
    onTertiary = PureWhite,
    background = DarkBg,
    onBackground = DarkText,
    surface = DarkSurface,
    onSurface = DarkText,
    surfaceVariant = DarkElevatedSurface,
    onSurfaceVariant = DarkMutedText,
    outline = CardBorderDark,
    error = FinancialNegative,
    onError = PureWhite
)

private val FinoraLightColorScheme = lightColorScheme(
    primary = RoyalNavy,
    onPrimary = PureWhite,
    primaryContainer = Color(0xFFEDF2F7),
    onPrimaryContainer = RoyalNavy,
    secondary = MetallicGold,
    onSecondary = DeepNavy,
    secondaryContainer = Color(0xFFFFF9E6),
    onSecondaryContainer = DeepNavy,
    tertiary = FinancialPositive,
    onTertiary = PureWhite,
    background = LightBg,
    onBackground = MainText,
    surface = PureWhite,
    onSurface = MainText,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = MutedText,
    outline = CardBorderLight,
    error = FinancialNegative,
    onError = PureWhite
)

@Composable
fun FinoraTheme(
    themePreference: String = "system", // "light", "dark", "system"
    content: @Composable () -> Unit
) {
    val isDark = when (themePreference.lowercase()) {
        "dark" -> true
        "light" -> false
        else -> isSystemInDarkTheme()
    }

    val colorScheme = if (isDark) FinoraDarkColorScheme else FinoraLightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
