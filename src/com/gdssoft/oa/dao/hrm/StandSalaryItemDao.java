package com.gdssoft.oa.dao.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.StandSalaryItem;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface StandSalaryItemDao extends BaseDao<StandSalaryItem>{

	public List<StandSalaryItem> getAllByStandardId(Long standardId);
	
}