package com.gdssoft.oa.dao.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.model.personal.DutyRegister;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface DutyRegisterDao extends BaseDao<DutyRegister>{
	/**
	 * 查取当前用户当天上下班登记情况
	 * @param userId
	 * @param inOffFlag
	 * @param sectionId
	 * @return
	 */
	public DutyRegister getTodayUserRegister(Long userId,Short inOffFlag,Long sectionId);
}