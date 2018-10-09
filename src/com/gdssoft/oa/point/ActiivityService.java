package com.gdssoft.oa.point;

import java.text.ParseException;
import java.util.Map;

import javax.jws.WebMethod;
import javax.jws.WebService;

import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.jw.JwArchives;

@WebService
public interface ActiivityService {

	String getPreviousStep(String taskId);

	String getprocessRunDetail(Long taskId, Long runId);

	String getStop(String piId);


	String getnext(Long taskId, String ccUserIds, String sendMail,
			String sendMsg, String sendInfo, String activityName,
			String status, String comments, String isBack, boolean isStartFlow,
			String userId, String piId, String taskName, String destName,
			String signalName, Long CurrentUser, String signUserIds,
			String formParamters);


	String saveSms(Long userId, String userIds, String content);

	String flowDefTasks(Long runId);

	JwArchives getarchive(JwArchives jwArchives);


}
