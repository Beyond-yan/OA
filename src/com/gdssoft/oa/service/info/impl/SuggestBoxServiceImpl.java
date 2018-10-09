package com.gdssoft.oa.service.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.oa.dao.info.SuggestBoxDao;
import com.gdssoft.oa.model.info.SuggestBox;
import com.gdssoft.oa.service.info.SuggestBoxService;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class SuggestBoxServiceImpl extends BaseServiceImpl<SuggestBox> implements SuggestBoxService{
	private SuggestBoxDao dao;
	
	public SuggestBoxServiceImpl(SuggestBoxDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	@Override
	public  List<SuggestBox> ggetAll(Object[] param, QueryFilter filter)
	{
		return dao.ggetAll(param, filter);
	}

	@Override
	public List<SuggestBox> gListResAll(Object[] param, QueryFilter filter)
	{
		return dao.gListResAll(param, filter);
	}
	
	

}