package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.IndexDisplay;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface IndexDisplayDao extends BaseDao<IndexDisplay>{
	/**
	 * 根据当前用户查找相应的模块。
	 * @param userId
	 * @return
	 */
	public List<IndexDisplay> findByUser(Long userId);
}