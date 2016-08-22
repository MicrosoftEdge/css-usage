function getPatternUsage(results, domClasses, cssClasses) {
    results.PatClearfixUsage = detectedClearfixUsages(domClasses);
	results.PatVisibilityUsage = detectedVisibilityUsages(domClasses);
    results.PatClearfixRecognized = detectedClearfixUsages(cssClasses);
    results.PatVisibilityRecognized = detectedVisibilityUsages(cssClasses);

    return results;
}