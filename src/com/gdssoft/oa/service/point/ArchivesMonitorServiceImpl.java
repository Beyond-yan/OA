package com.gdssoft.oa.service.point;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.jws.WebService;

import com.gdssoft.oa.dao.archive.ArchivesMonitorDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesMonitor;

@WebService(endpointInterface = "com.gdssoft.oa.service.point.ArchivesMonitorService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class ArchivesMonitorServiceImpl implements ArchivesMonitorService {

	@Resource
	private ArchivesMonitorDao ArchivesMonitorDao;

	@Override
	public String SearchPublicArchives(String schemaCode, String username)
			throws ParseException {
		List<ArchivesMonitor> tempList = new ArrayList();
		tempList = ArchivesMonitorDao.findArchivesMonitor(schemaCode, username);
		String result = "";
		StringBuffer buff = new StringBuffer("{\"Status\": 0,\"Data\":[");
		for (ArchivesMonitor archivesMonitor : tempList) {
			buff.append("{\"archivesId\":\"")
					.append(archivesMonitor.getArchivesId())
					.append("\",\"subject\":\"")
					.append(archivesMonitor.getSubject())
					.append("\",\"runId\":\"")
					.append(archivesMonitor.getRunId())
					.append("\",\"archchecker\":\"")
					.append(archivesMonitor.getArchChecker())
					.append("\",\"activityname\":\"")
					.append(archivesMonitor.getActivityname())
					.append("\",\"activityname\":\"")
					.append(archivesMonitor.getActivityname())
					.append("\",\"issuer\":\"")
					.append(archivesMonitor.getIssuer())
					.append("\",\"creatorname\":\"")
					.append(archivesMonitor.getCreatorname())
					.append("\",\"comments\":\"")
					.append(archivesMonitor.getComments())
					.append("\",\"createtime\":\"")
					.append(archivesMonitor.getCreatetime())
					.append("\",\"limited_date\":\"")
					.append(archivesMonitor.getLimitedDate())
					.append("\",\"filepath\":\"")
					.append(archivesMonitor.getFilepath())
					.append("\",\"filename\":\"")
					.append(archivesMonitor.getFilename())
					.append("\",\"docpath\":\"")
					.append(archivesMonitor.getDocpath())
					.append("\",\"docname\":\"")
					.append(archivesMonitor.getDocname()).append("\"}");
			buff.append(",");
		}
		buff.deleteCharAt(buff.length() - 1);// 删除最后一个","字符
		buff.append("]}");
		result = buff.toString();
		return result;
	}
}
