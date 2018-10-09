package com.gdssoft.oa.dao.archive.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.archive.ArchivesDao;
import com.gdssoft.oa.dao.archive.ArchivesMonitorDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesMonitor;

public class ArchivesMonitorDaoImpl extends BaseDaoImpl<ArchivesMonitor> implements ArchivesMonitorDao {

	public ArchivesMonitorDaoImpl() {
		super(Archives.class);
	}

	@Override
	public List<ArchivesMonitor> findArchivesMonitor(String schemaCode, String username) throws ParseException {
		if (StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode + ".";
		String sql = "SELECT A.ARCHIVESID,A.SUBJECT , b.runid, a.arch_checker, c.activityname, a.issuer, c.creatorname, c.comments, c.createtime, a.limited_date,E.filepath , E.filename, f.docpath, f.docname FROM "
				+ schemaCode
				+ "archives a JOIN "
				+ schemaCode
				+ "process_run b ON a.process_ins_id = b.runid JOIN "
				+ schemaCode
				+ "process_form c ON a.process_ins_id = c.runid left join "
				+ schemaCode
				+ "ARCHIVES_ATTACHMENT d on A.ARCHIVESID=D.ARCHIVESID left join "
				+ schemaCode
				+ "FILE_ATTACH e on D.FILEID=E.FILEID  LEFT JOIN "
				+ schemaCode
				+ "archives_doc f ON a.archivesid = f.archivesid WHERE a.arch_checker IS NOT NULL";
		Query q = getSession().createSQLQuery(sql);
		List list = q.list();
		List<ArchivesMonitor> tempList = new ArrayList<ArchivesMonitor>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			ArchivesMonitor monitor = new ArchivesMonitor();
			if(null!=objs[0])
			monitor.setArchivesId(new Long(objs[0].toString()));
			if(null!=objs[1])
			monitor.setSubject(objs[1].toString());
			if(null!=objs[2])
			monitor.setRunId(new Long(objs[2].toString()));
			if(null!=objs[3])
			monitor.setArchChecker(objs[3].toString());
			if(null!=objs[4])
			monitor.setActivityname(objs[4].toString());
			if(null!=objs[5])
			monitor.setIssuer(objs[5].toString());
			if(null!=objs[6])
			monitor.setCreatorname(objs[6].toString());
			if(null!=objs[7])
			monitor.setComments(objs[7].toString());
			if(null!=objs[8])
			monitor.setCreatetime(sdf.format(objs[8]));
			if(null!=objs[9])
			monitor.setLimitedDate(sdf.format(objs[9]));
			if(null!=objs[10])
			monitor.setFilepath(objs[10].toString());
			if(null!=objs[11])
			monitor.setFilename(objs[11].toString());
			if(null!=objs[12])
				monitor.setDocpath(objs[12].toString());
			if(null!=objs[13])
				monitor.setDocname(objs[13].toString());
			tempList.add(monitor);
		}
		return tempList;
	}
}
