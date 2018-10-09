package com.gdssoft.oa.dao.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.personal.AddrbookOuter;

/**
 * 
 * @author 
 *
 */
public interface AddrbookOuterDao extends BaseDao<AddrbookOuter>{

	List<AddrbookOuter> getouter(String personname);
	
}