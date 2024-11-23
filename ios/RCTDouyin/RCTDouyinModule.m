//
//  RCTDouyinModule.m
//  sexlimit
//
//  Created by ByteDance on 11/23/24.
//

#import "RCTDouyinModule.h"
#import <DouyinOpenSDK/DouyinOpenSDKAuth.h>
#import <React/RCTLog.h>

@implementation RCTDouyinModule

RCT_EXPORT_MODULE(DouyinModule);

RCT_EXPORT_METHOD(init:(NSString *)appid
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      
     [[DouyinOpenSDKApplicationDelegate sharedInstance] registerAppId:appid];
  });
}

// 登录
RCT_EXPORT_METHOD(login:(NSString *)scope
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      
     DouyinOpenSDKAuthRequest *req = [[DouyinOpenSDKAuthRequest alloc] init];
      
     req.permissions = [NSOrderedSet orderedSetWithObject:scope];
     // req.state=state;
      
     UIViewController *vc =  [UIApplication sharedApplication].keyWindow.rootViewController;
      
     [req sendAuthRequestViewController:vc completeBlock:^(DouyinOpenSDKAuthResponse * _Nonnull resp) {
     if (resp.errCode == 0) {
               resolve(@{
                   @"code": resp.code
               });
            } else{
                [NSString stringWithFormat:@"Author failed code : %@, msg : %@",@(resp.errCode), resp.errString];
                reject([NSString stringWithFormat:@"%@",@(resp.errCode)],resp.errString,nil);
            }
        }];
   
  });
}

@end
