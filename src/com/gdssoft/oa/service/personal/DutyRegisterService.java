package com.gdssoft.oa.service.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;

import com.gdssoft.oa.model.personal.DutyRegister;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;

public interface DutyRegisterService extends BaseService<DutyRegister>{
	/**
	 * 签到,签退
	 * @param sectionId 班次
	 * @param signInOff 1=signIn 2=signOff
	 * @param curUser 用户
	 * @param 登记时间
	 */
	public void signInOff(Long sectionId,Short signInOff,AppUser curUser,Date registerDate);
	
	/**
	 * 查取当前用户当天上下班登记情况
	 * @param userId
	 * @param inOffFlag
	 * @param sectionId
	 * @return
	 */
	public DutyRegister getTodayUserRegister(Long userId,Short inOffFlag,Long sectionId);
}


