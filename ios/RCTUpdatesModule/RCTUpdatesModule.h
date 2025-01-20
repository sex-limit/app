//
//  RCTUpdatesModule.h
//  reactnativeupdatespatch
//
//  Created by ByteDance on 1/20/25.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTUpdatesModule : NSObject <RCTBridgeModule>

+ (NSURL *)getBundleUrl;

@end

NS_ASSUME_NONNULL_END
