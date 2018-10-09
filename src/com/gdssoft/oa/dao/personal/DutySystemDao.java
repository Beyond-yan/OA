package com.gdssoft.oa.dao.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.personal.DutySystem;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface DutySystemDao extends BaseDao<DutySystem>{
	/**
	 *  更新为非缺省
	 */
	public void updateForNotDefult();
	/**
	 * 取得缺省的班制
	 * @return
	 */
	public List<DutySystem> getDefaultDutySystem();
}