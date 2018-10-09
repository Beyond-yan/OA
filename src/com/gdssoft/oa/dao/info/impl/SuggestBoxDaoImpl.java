package com.gdssoft.oa.dao.info.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.oa.dao.info.SuggestBoxDao;
import com.gdssoft.oa.model.info.SuggestBox;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;

public class SuggestBoxDaoImpl extends BaseDaoImpl<SuggestBox> implements
		SuggestBoxDao
{

	public SuggestBoxDaoImpl()
	{
		super(SuggestBox.class);
	}

	@Override
	public List<SuggestBox> ggetAll(Object[] param, QueryFilter filter)
	{
		String hql = " from SuggestBox sb where sb.subject like'%{SUBJECT}%'  and sb.queryPwd='1'";
		hql += " and sb.senderFullname like '%{SENDER}%' and sb.createtime between '{TF}' and '{TT}'";
		hql += "  and  ( (sb.recUid ={UID} or sb.senderId={UID}) or (sb.isOpen=0 and sb.status !=0 ))";
		hql = hql.replace("{SUBJECT}", param[0].toString());
		hql = hql.replace("{SENDER}", param[1].toString());
		hql = hql.replace("{TF}", param[2].toString());
		hql = hql.replace("{TT}", param[3].toString());
		hql = hql.replace("{UID}", param[4].toString());		
		logger.info(hql);
		return findByHql(hql, null, filter.getPagingBean());

	}

	@Override
	public List<SuggestBox> gListResAll(Object[] param, QueryFilter filter)
	{
		String hql = " from SuggestBox sb where sb.subject like'%{SUBJECT}%'  and sb.queryPwd='2' ";
		//hql += " and sb.senderFullname like '%{SENDER}%' and sb.createtime between '{TF}' and '{TT}'";
		hql += " and sb.senderFullname like '%{SENDER}%' and sb.createtime between to_date('{TF}','yyyy-MM-dd') and to_date('{TT}','yyyy-MM-dd')";//for oracle
		hql += "  and (  (sb.recUid={RECID}  or sb.senderId={UID} )  or (  sb.isOpen=0 and sb.status !=0 ) )";
		hql = hql.replace("{SUBJECT}", param[0].toString());
		hql = hql.replace("{SENDER}", param[1].toString());
		hql = hql.replace("{TF}", param[2].toString());
		hql = hql.replace("{TT}", param[3].toString());
		hql = hql.replace("{UID}", param[4].toString());
		hql = hql.replace("{RECID}", param[6].toString());
		
		logger.info(hql);
		return findByHql(hql, null, filter.getPagingBean());
	}
}