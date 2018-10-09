package com.gdssoft.oa.dao.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface SmsMobileDao extends BaseDao<SmsMobile>{

	public List<SmsMobile> getNeedToSend();
	
	public List<SmsMobile> findByDepAndTeam(Long depId,Long teamId, int start, int size,Date sendTime, String recipients, String phoneNumber, long userId);
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId);
	public List<SmsMobile> findSmsMobileBySchema(String schemaCode);
	public void updateSmsMobileStatus(String schemaCode,long smsId,int status);
	public void saveSmsMobileHis(String schemaCode,long smsId);
	public void delSmsMobile(String schemaCode,long smsId);
	public void saveSmsMobile(String schemaCode, SmsMobile smsMobile);
	
}