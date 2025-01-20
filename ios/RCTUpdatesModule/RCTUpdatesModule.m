//
//  RCTUpdatesModule.m
//  reactnativeupdatespatch
//
//  Created by ByteDance on 1/20/25.
//

#import "RCTUpdatesModule.h"
#import <React/RCTBundleURLProvider.h>
#import "React/RCTReloadCommand.h"
#import <React/RCTLog.h>

@implementation RCTUpdatesModule

RCT_EXPORT_MODULE();

+ (NSString *)getBundleHistoryPath {
    NSString *documentsPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
    NSString *historyPath = [documentsPath stringByAppendingPathComponent:@"bundle_history.json"];
    NSLog(@"Bundle history path: %@", historyPath);
    return historyPath;
}

+ (void)initializeBundleHistory {
    NSString *historyPath = [self getBundleHistoryPath];
    if (![[NSFileManager defaultManager] fileExistsAtPath:historyPath]) {
        NSLog(@"Initializing bundle history file");
        NSURL *defaultURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
        NSDictionary *history = @{@"activeBundlePath": defaultURL.path};
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:history options:NSJSONWritingPrettyPrinted error:nil];
        [jsonData writeToFile:historyPath atomically:YES];
        NSLog(@"Created bundle history with default path: %@", defaultURL.path);
    }
}

+ (NSURL *)getBundleUrl {
    [self initializeBundleHistory];
    NSString *historyPath = [self getBundleHistoryPath];
    NSData *jsonData = [NSData dataWithContentsOfFile:historyPath];
    if (jsonData) {
        NSDictionary *history = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:nil];
        NSString *bundlePath = history[@"activeBundlePath"];
        if (bundlePath) {
            NSLog(@"Retrieved bundle URL from history: %@", bundlePath);
            return [NSURL fileURLWithPath:bundlePath];
        }
    }
    NSURL *defaultURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    NSLog(@"Using default bundle URL: %@", defaultURL);
    return defaultURL;
}

+ (void)setBundlePath:(NSString *)bundlePath {
    NSLog(@"Setting new bundle path: %@", bundlePath);
    NSString *historyPath = [self getBundleHistoryPath];
    NSDictionary *history = @{@"activeBundlePath": bundlePath};
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:history options:NSJSONWritingPrettyPrinted error:nil];
    [jsonData writeToFile:historyPath atomically:YES];
}

+ (void)reloadBundleWithURL:(NSURL *)bundleURL {
    NSLog(@"Reloading bundle with URL: %@", bundleURL);
    RCTReloadCommandSetBundleURL(bundleURL);
}

+ (void)reloadBundle {
    NSLog(@"Reloading bundle with URL: %@");
    RCTTriggerReloadCommandListeners(@"react-native-restart: Restart");
}

+ (void)reloadFullBundle: (NSURL *)bundleURL {
  NSLog(@"HotUpdater requested a reload");
      dispatch_async(dispatch_get_main_queue(), ^{
        RCTReloadCommandSetBundleURL(bundleURL);
        RCTTriggerReloadCommandListeners(@"react-native-restart: Restart");
  });
}

RCT_EXPORT_METHOD(getBundleURL:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSURL *bundleURL = [RCTUpdatesModule getBundleUrl];
    NSLog(@"getBundleURL called, returning: %@", bundleURL.absoluteString);
    resolve(bundleURL.absoluteString);
}

RCT_EXPORT_METHOD(setBundlePath:(NSString *)bundlePath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"setBundlePath called with path: %@", bundlePath);
    [RCTUpdatesModule setBundlePath:bundlePath];
    resolve(@YES);
}

RCT_EXPORT_METHOD(reloadBundleWithURL:(NSString *)bundleURLString) {
    NSLog(@"reloadBundle called with URL string: %@", bundleURLString);
    NSURL *bundleURL;
    if (bundleURLString) {
        bundleURL = [NSURL URLWithString:bundleURLString];
    }
    if (!bundleURL) {
        bundleURL = [RCTUpdatesModule getBundleUrl];
        NSLog(@"Using fallback bundle URL: %@", bundleURL);
    }
    [RCTUpdatesModule reloadBundleWithURL:bundleURL];
}

RCT_EXPORT_METHOD(reloadBundle) {
  [RCTUpdatesModule reloadBundle];
}

RCT_EXPORT_METHOD(reload:(NSURL *)bundleURLString) {
  [RCTUpdatesModule reloadFullBundle:bundleURLString];
}

@end
