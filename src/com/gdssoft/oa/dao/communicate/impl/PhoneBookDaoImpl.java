package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.communicate.PhoneBookDao;
import com.gdssoft.oa.model.communicate.PhoneBook;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class PhoneBookDaoImpl extends BaseDaoImpl<PhoneBook> implements PhoneBookDao{

	public PhoneBookDaoImpl() {
		super(PhoneBook.class);
	}

	@Override
	public List<PhoneBook> sharedPhoneBooks(String fullname, String ownerName,PagingBean pb) {
		StringBuffer hql=new StringBuffer("select pb from PhoneBook pb,PhoneGroup pg where pb.phoneGroup=pg and (pg.isShared=1 or pb.isShared=1)");
		List list=new ArrayList();
		if(StringUtils.isNotEmpty(fullname)){
			hql.append(" and pb.fullname like ?");
			list.add("%"+fullname+"%");
		}
		if(StringUtils.isNotEmpty(ownerName)){
			hql.append(" and pb.appUser.fullname like ?");
			list.add("%"+ownerName+"%");
		}
		return findByHql(hql.toString(), list.toArray(), pb);
	}

}