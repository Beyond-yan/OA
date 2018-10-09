package com.gdssoft.oa.service.communicate;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.communicate.SmsHistory;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.core.service.BaseService;

public interface SmsMobileService extends BaseService<SmsMobile>{
	public List<SmsMobile> getNeedToSend();
	public void saveSms(String userIds,String content);
	public void sendSms();
	/**
	 * 发送短信几口
	 * @param smsMobile
	 */
	public void sendOneSms(SmsMobile smsMobile);
	
	public List<SmsMobile> findByDepAndTeam(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId);
	
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId);
	public void updateSmsMobileStatus(String schemaCode,long smsId,int status);
	public void saveSmsMobileHis(String schemaCode,long smsId);
	public void delSmsMobile(String schemaCode,long smsId);
	
	public void saveSms(String schemaCode, String userIds, String content);
}


