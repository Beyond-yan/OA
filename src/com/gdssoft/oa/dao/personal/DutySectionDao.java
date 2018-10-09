package com.gdssoft.oa.dao.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.personal.Duty;
import com.gdssoft.oa.model.personal.DutySection;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface DutySectionDao extends BaseDao<DutySection>{
	
	/**
	 * 获取所有的班次
	 * @return
	 */
	public List<DutySection> getAllDutySection();
	
}