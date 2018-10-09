package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchRecUser;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface ArchRecUserDao extends BaseDao<ArchRecUser>{
	public List findDepAll();

	public ArchRecUser getByDepId(Long depId);
}