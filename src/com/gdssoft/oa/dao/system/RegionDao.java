package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.Region;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface RegionDao extends BaseDao<Region>{

	public List<Region> getProvince();

	public List<Region> getCity(Long regionId);
	
}