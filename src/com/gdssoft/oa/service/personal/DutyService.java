package com.gdssoft.oa.service.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;

import com.gdssoft.oa.model.personal.Duty;
import com.gdssoft.core.service.BaseService;

public interface DutyService extends BaseService<Duty>{
	/**
	 * 检查当前这个时间段是否横跨于现有的该用户班制时间
	 * @param userId
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public boolean isExistDutyForUser(Long userId,Date startTime,Date endTime);
	
	/**
	 * 取当前用户的班制
	 * @param userId
	 * @return
	 */
	public Duty getCurUserDuty(Long userId);
}


